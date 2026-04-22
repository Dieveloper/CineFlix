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
<<<<<<< HEAD
    public string? FotoUrl { get; set; }
=======
>>>>>>> 964b85330d0b870f769c24f540f5621aec26f1d8
    
    [ForeignKey("UsuarioId")]
    public Usuarios? Usuario { get; set; }
}