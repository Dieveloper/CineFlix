using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class registerRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string email {get; set;} = string.Empty;
    public string Password {get; set;} = string.Empty;
}