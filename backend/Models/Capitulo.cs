using System.ComponentModel.DataAnnotations;         
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Models;

public class Capitulo
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int SerieId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? VideoUrl { get; set; }
    public string? ImagenUrl { get; set; }
    public int Numero { get; set; }

    [ForeignKey("SerieId")]
    public Serie? Serie { get; set; }
}