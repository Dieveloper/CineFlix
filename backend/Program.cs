using Microsoft.EntityFrameworkCore;
using backend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Conexión a la base de datos (SQLite)
builder.Services.AddDbContext<CineContext>(options =>
    options.UseSqlite("Data Source=cineflix.db"));

// 2. Configurar Controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3. Activar Swagger para pruebas
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers(); // Esto hace que tus Controllers funcionen

app.Run();