namespace codex_backend.Models;


public class Category
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<Book> Books { get; set; } = [];
}