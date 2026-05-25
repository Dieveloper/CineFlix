using System.ComponentModel.DataAnnotations;         
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Models;


public class Perfil
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int UsuarioId { get; set; } 
    public bool EsAdmin { get; set; }
    [ForeignKey("UsuarioId")]
    public Usuarios? Usuario { get; set; }
    
    public string? FotoUrl { get; set; }
}