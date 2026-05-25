using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Pelicula
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Director { get; set; } = string.Empty;
    public string Sinopsis { get; set; } = string.Empty;
    public int Anio { get; set; }
    public string? VideoUrl { get; set; } = string.Empty;
    public string? ImagernUrl { get; set; } = string.Empty;
    public string? Genero { get; set; } = string.Empty;
}