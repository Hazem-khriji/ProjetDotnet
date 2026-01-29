using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjetDotnet.Models;

namespace ProjetDotnet.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Property> Properties { get; set; }
        public DbSet<PropertyImage> PropertyImages { get; set; }
        public DbSet<Inquiry> PropertyRequests { get; set; }
        public DbSet<PropertyView> PropertyViews { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Property Configuration
            builder.Entity<Property>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);
                
                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(2000);
                
                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18,2)");
                
                entity.Property(e => e.Area)
                    .HasColumnType("decimal(10,2)");
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Properties)
                    .HasForeignKey(e => e.Id)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.Type);
                entity.HasIndex(e => e.CreatedAt);
            });

            // PropertyImage Configuration
            builder.Entity<PropertyImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.ImageUrl)
                    .IsRequired();
                
                entity.HasOne(e => e.Property)
                    .WithMany(p => p.Images)
                    .HasForeignKey(e => e.PropertyId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasIndex(e => new { e.PropertyId, e.DisplayOrder });
            });

            // PropertyRequest Configuration
            builder.Entity<PropertyRequest>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Message)
                    .IsRequired()
                    .HasMaxLength(1000);
                
                entity.Property(e => e.PhoneNumber)
                    .IsRequired();
                
                entity.HasOne(e => e.Property)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(e => e.PropertyId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Requests)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.RequestDate);
            });

            // Message Configuration
            builder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Subject)
                    .IsRequired()
                    .HasMaxLength(200);
                
                entity.Property(e => e.Content)
                    .IsRequired()
                    .HasMaxLength(2000);
                
                entity.HasOne(e => e.Sender)
                    .WithMany(u => u.SentMessages)
                    .HasForeignKey(e => e.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(e => e.Receiver)
                    .WithMany(u => u.ReceivedMessages)
                    .HasForeignKey(e => e.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(e => e.Property)
                    .WithMany()
                    .HasForeignKey(e => e.PropertyId)
                    .OnDelete(DeleteBehavior.SetNull);
                
                entity.HasIndex(e => e.IsRead);
                entity.HasIndex(e => e.SentDate);
            });

            // PropertyView Configuration
            builder.Entity<PropertyView>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.IpAddress)
                    .IsRequired()
                    .HasMaxLength(50);
                
                entity.HasOne(e => e.Property)
                    .WithMany(p => p.Views)
                    .HasForeignKey(e => e.PropertyId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
                
                entity.HasIndex(e => e.ViewDate);
            });
        }
    }
}