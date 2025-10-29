using codex_backend.Application.Dtos;
using codex_backend.Application.Services.Interfaces;
using codex_backend.Application.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace codex_backend.Application.Services.Token;

public class JwtService(IOptions<TokenSettings> opt, IRoleService roleService, IBookstoreService bookstoreService) : IJwtService
{
    private readonly TokenSettings _settings = opt.Value;
    private readonly IRoleService _roleService = roleService;
    private readonly IBookstoreService _bookstoreService = bookstoreService;
    public async Task<TokenResultDto> GenerateTokenAsync(UserReadDto user)
    {
        var roleDto = await _roleService.GetRoleNameAsync(user.RoleId);
        var ownedBookstores = await _bookstoreService.GetBookstoresByOwnerIdAsync(user.Id);
        var isBookstoreOwner = ownedBookstores.Any();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email!),
            new(ClaimTypes.Role, roleDto!)
        };
      
        if (isBookstoreOwner)
        {
            claims.Add(new Claim("is_bookstore_owner", "true"));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expirationDate = DateTime.UtcNow.AddDays(_settings.ExpiresInDays);

        var token = new JwtSecurityToken(
        issuer: _settings.Issuer,
        audience: _settings.Audience,
        claims: claims,
        expires: expirationDate,
        signingCredentials: creds
        );

        var handler = new JwtSecurityTokenHandler();
        return new TokenResultDto
        {
            AccessToken = handler.WriteToken(token),
            Expiration = expirationDate
        };

    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_settings.Key);

        try
        {
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = _settings.Issuer,
                ValidateAudience = true,
                ValidAudience = _settings.Audience,
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true
            }, out SecurityToken validatedToken);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}