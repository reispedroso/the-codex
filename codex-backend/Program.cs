using DotNetEnv;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using codex_backend.Database;
using codex_backend.Infra.Repositories;
using codex_backend.Application.Handlers;
using codex_backend.Application.Settings;
using codex_backend.Application.Factories;
using codex_backend.Application.Services.Token;
using codex_backend.Application.Authorization.Common.Middleware;
using codex_backend.Application.Services.Interfaces;
using codex_backend.Application.Authorization.Handlers;
using codex_backend.Application.Repositories.Interfaces;
using codex_backend.Application.Services.Implementations;
using codex_backend.Application.Authorization.Requirements;

var envPath = Path.Combine(Directory.GetCurrentDirectory(), "..", ".env");
if (File.Exists(envPath))
{
    Env.Load(envPath);
}

var builder = WebApplication.CreateBuilder(args);

var host = builder.Configuration["DB_HOST"];
var port = builder.Configuration["DB_PORT"];
var db = builder.Configuration["DB_NAME"];
var user = builder.Configuration["DB_USER"];
var password = builder.Configuration["DB_PASSWORD"];
if (string.IsNullOrEmpty(password))
{
    password = builder.Configuration["POSTGRES_PASSWORD"];
}

var connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={password}";

var jwtKey = builder.Configuration["TokenSettings:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("A chave JWT (TokenSettings:Key) não foi encontrada ou está vazia na configuração.");
}

builder.Services.Configure<TokenSettings>(builder.Configuration.GetSection("TokenSettings"));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var tokenSettings = builder.Configuration.GetSection("TokenSettings").Get<TokenSettings>();
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = tokenSettings!.Issuer,
        ValidateAudience = true,
        ValidAudience = tokenSettings.Audience,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)) 
    };
});

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("CanManageBookstorePolicy", policy =>
        policy.AddRequirements(new ResourceOwnerRequirement()));

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("CanManageReservationPolicy", policy =>
        policy.AddRequirements(new ResourceOwnerRequirement()));


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped<IAuthorRepository, AuthorRepository>();
builder.Services.AddScoped<IBookItemRepository, BookItemRepository>();
builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<IBookReviewRepository, BookReviewRepository>();
builder.Services.AddScoped<IBookstoreRepository, BookstoreRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IRentalRepository, RentalRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
builder.Services.AddScoped<IStorePolicyPricesRepository, StorePolicyPriceRepository>();
builder.Services.AddScoped<IStorePolicyRepository, StorePolicyRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();


builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IAuthorService, AuthorService>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IBookItemService, BookItemService>();
builder.Services.AddScoped<IBookstoreService, BookstoreService>();
builder.Services.AddScoped<IRentalService, RentalService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStorePolicyService, StorePolicyService>();


builder.Services.AddScoped<IReservationFactory, ReservationFactory>();
builder.Services.AddScoped<IRentalFactory, RentalFactory>();
builder.Services.AddScoped<IUserFactory, UserFactory>();


builder.Services.AddScoped<InventoryHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, BookstoreAuthorizationHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, ReservationAuthorizationHandler>();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                        
                          policy.WithOrigins("http://localhost:3000") 
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();