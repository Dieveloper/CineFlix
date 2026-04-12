using System.ComponentModel.DataAnnotations;         
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Models;


public class Usuarios
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
   public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    public string email {get; set;} = string.Empty;

    public string Password {get; set;} = string.Empty;
    public List<Perfil> Perfiles { get; set; } = new List<Perfil>();
}