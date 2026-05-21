using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FixImagenUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImagernUrl",
                table: "Series",
                newName: "ImagenUrl");

            migrationBuilder.RenameColumn(
                name: "ImagernUrl",
                table: "Peliculas",
                newName: "ImagenUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImagenUrl",
                table: "Series",
                newName: "ImagernUrl");

            migrationBuilder.RenameColumn(
                name: "ImagenUrl",
                table: "Peliculas",
                newName: "ImagernUrl");
        }
    }
}
