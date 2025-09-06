using System.ComponentModel.DataAnnotations;

public class MediaItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Type { get; set; } = default!; // "TV", "Movie", "Book", "Music"
    public string Creator { get; set; } = default!; // Author/Director/Artist
    public string Genre { get; set; } = default!;
    public int? Year { get; set; }
    public DateTime DateAdded { get; set; }
}

public class CreateMediaItemDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = default!;

    [Required]
    [RegularExpression("^(TV|Movie|Book|Music)$", ErrorMessage = "Type must be TV, Movie, Book, or Music")]
    public string Type { get; set; } = default!;

    [Required]
    [StringLength(200)]
    public string Creator { get; set; } = default!;

    [StringLength(100)]
    public string Genre { get; set; } = default!;

    public int? Year { get; set; }
}

public class UpdateMediaItemDto
{
    [StringLength(200, MinimumLength = 1)]
    public string? Title { get; set; }

    [RegularExpression("^(TV|Movie|Book|Music)$", ErrorMessage = "Type must be TV, Movie, Book, or Music")]
    public string? Type { get; set; }

    [StringLength(200)]
    public string? Creator { get; set; }

    [StringLength(100)]
    public string? Genre { get; set; }

    public int? Year { get; set; }
}