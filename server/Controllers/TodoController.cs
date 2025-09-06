using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private static readonly List<MediaItemDto> _mediaItems = new();

        // GET: api/media
        [HttpGet]
        public ActionResult<IEnumerable<MediaItemDto>> GetAll([FromQuery] string? type, [FromQuery] string? genre, [FromQuery] int? year)
        {
            var query = _mediaItems.AsQueryable();
            if (!string.IsNullOrEmpty(type)) query = query.Where(m => m.Type == type);
            if (!string.IsNullOrEmpty(genre)) query = query.Where(m => m.Genre == genre);
            if (year.HasValue) query = query.Where(m => m.Year == year.Value);
            return Ok(query.ToList());
        }

        // GET: api/media/random?type=Movie
        [HttpGet("random")]
        public ActionResult<MediaItemDto> GetRandom([FromQuery] string type)
        {
            var filtered = _mediaItems.Where(m => m.Type == type).ToList();
            if (!filtered.Any()) return NotFound();
            var rand = new Random();
            return Ok(filtered[rand.Next(filtered.Count)]);
        }

        // POST: api/media
        [HttpPost]
        public ActionResult<MediaItemDto> Create([FromBody] CreateMediaItemDto dto)
        {
            var item = new MediaItemDto
            {
                Id = _mediaItems.Count > 0 ? _mediaItems.Max(m => m.Id) + 1 : 1,
                Title = dto.Title,
                Type = dto.Type,
                Creator = dto.Creator,
                Genre = dto.Genre,
                Year = dto.Year,
                DateAdded = DateTime.UtcNow
            };
            _mediaItems.Add(item);
            return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
        }

        // PUT: api/media/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateMediaItemDto dto)
        {
            var item = _mediaItems.FirstOrDefault(m => m.Id == id);
            if (item == null) return NotFound();

            if (dto.Title != null) item.Title = dto.Title;
            if (dto.Type != null) item.Type = dto.Type;
            if (dto.Creator != null) item.Creator = dto.Creator;
            if (dto.Genre != null) item.Genre = dto.Genre;
            if (dto.Year.HasValue) item.Year = dto.Year;

            return NoContent();
        }

        // DELETE: api/media/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _mediaItems.FirstOrDefault(m => m.Id == id);
            if (item == null) return NotFound();
            _mediaItems.Remove(item);
            return NoContent();
        }
    }
}