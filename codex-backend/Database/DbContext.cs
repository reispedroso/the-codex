using Microsoft.EntityFrameworkCore;
using codex_backend.Models;
using codex_backend.Database.Configuration;

namespace codex_backend.Database;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    private static readonly Guid _adminRoleId = new Guid("982b31d7-e26c-442b-9593-d774c107facd");
    private static readonly Guid _clientRoleId = new Guid("d9ebb4d7-d74c-4a63-a296-7910ca646928");
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Bookstore> Bookstores { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookItem> BookItems { get; set; }
    public DbSet<BookReview> BookReviews { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<StorePolicyPrice> StorePolicyPrice { get; set; }
    public DbSet<StorePolicy> StorePolicy { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Rental> Rentals { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new AuthorConfiguration());
        modelBuilder.ApplyConfiguration(new BookConfiguration());
        modelBuilder.ApplyConfiguration(new BookItemConfiguration());
        modelBuilder.ApplyConfiguration(new BookReviewConfiguration());
        modelBuilder.ApplyConfiguration(new BookstoreConfiguration());
        modelBuilder.ApplyConfiguration(new StorePolicyConfiguration());
        modelBuilder.ApplyConfiguration(new StorePolicyPriceConfiguration());
        modelBuilder.ApplyConfiguration(new ReservationConfiguration());
        modelBuilder.ApplyConfiguration(new RentalConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new RoleConfiguration());


        modelBuilder.Entity<Role>().HasData(
         new Role { Id = _adminRoleId, Name = "Admin" },
         new Role { Id = _clientRoleId, Name = "Client" });

        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSnakeCaseNamingConvention();
    }
}
