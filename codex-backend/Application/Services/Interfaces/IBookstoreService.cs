using codex_backend.Application.Dtos;
using codex_backend.Models;

namespace codex_backend.Application.Services.Interfaces
{
    public interface IBookstoreService
    {
        Task<BookstoreReadDto> CreateBookstoreAsync(BookstoreCreateDto dto, Guid ownerUserId);
        Task<IEnumerable<BookstoreReadDto>> GetAllBookstoresAsync();
        Task<BookstoreReadDto> GetBookstoreByIdAsync(Guid id);
        Task<BookstoreReadDto> GetBookstoreByNameAsync(string name);
        Task<IEnumerable<BookstoreReadDto>> GetBookstoresByOwnerIdAsync(Guid ownerId);
        Task<BookstoreReadDto> UpdateBookstoreAsync(Guid id, BookstoreUpdateDto dto);
        Task DeleteBookstoreAsync(Guid id);
        Task<Bookstore?> GetBookstoreModelByIdAsync(Guid id);
    }
}