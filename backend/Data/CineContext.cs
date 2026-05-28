using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class CineContext : DbContext
{
    public CineContext(DbContextOptions<CineContext> options) : base(options) { }

    public DbSet<Pelicula> Peliculas => Set<Pelicula>();
    public DbSet<Serie> Series => Set<Serie>();
    public DbSet<Usuarios> Usuarios => Set<Usuarios>();
    public DbSet<Perfil> Perfil => Set<Perfil>();
    public DbSet<Capitulo> Capitulos { get; set; }
    }