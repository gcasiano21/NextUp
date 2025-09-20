using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly FirestoreDb _firestore;
        private readonly CollectionReference _mediaItemsCollection;

        public MediaController(FirestoreDb firestore)
        {
            _firestore = firestore;
            _mediaItemsCollection = _firestore.Collection("mediaItems");
        }
        private MediaItemDto MapDocumentToMediaItemDto(DocumentSnapshot doc)
        {
            if (!doc.Exists || doc.ToDictionary() == null)
            {
                return new MediaItemDto { Id = doc.Id, DateAdded = Timestamp.FromDateTime(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)) }; 
            }

            
            IDictionary<string, object> fields = doc.ToDictionary();

            return new MediaItemDto
            {
                Id = doc.Id,
                Title = fields.TryGetValue("Title", out object? titleObj) && titleObj is string title ? title : string.Empty,
                Type = fields.TryGetValue("Type", out object? typeObj) && typeObj is string type ? type : string.Empty,
                Creator = fields.TryGetValue("Creator", out object? creatorObj) && creatorObj is string creator ? creator : string.Empty,
                Genre = fields.TryGetValue("Genre", out object? genreObj) && genreObj is string genre ? genre : null, 
                Year = fields.TryGetValue("Year", out object? yearObj) && yearObj is long yearLong ? (int?)yearLong : null, 
                DateAdded = fields.TryGetValue("DateAdded", out object? dateAddedObj) && dateAddedObj is Timestamp dateAdded ? dateAdded : Timestamp.FromDateTime(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc))
            };
        }
        // POST: api/media/report
        [HttpPost("report")]
        public async Task<ActionResult<ReportItemDto>> Report([FromBody] InsertReportItemDto dto)
        {
            if (string.IsNullOrEmpty(dto.MediaTitle))
                return BadRequest(new { error = "MediaTitle is required" });

            var now = Timestamp.GetCurrentTimestamp();
            var reportsCollection = _firestore.Collection("reports"); 

            var data = new Dictionary<string, object>
            {
                { "MediaTitle", dto.MediaTitle },
                { "DateAdded", now }
            };

            if (!string.IsNullOrEmpty(dto.Issue)) data.Add("Issue", dto.Issue);
            if (!string.IsNullOrEmpty(dto.CorrectVersion)) data.Add("CorrectVersion", dto.CorrectVersion);

            var docRef = await reportsCollection.AddAsync(data);

            var created = new ReportItemDto
            {
                Id = docRef.Id,
                MediaTitle = dto.MediaTitle,
                Issue = dto.Issue,
                CorrectVersion = dto.CorrectVersion,
                DateAdded = now
            };

            return CreatedAtAction(nameof(Report), new { id = created.Id }, created);
        }

        // GET: api/media
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MediaItemDto>>> GetAll([FromQuery] string? type, [FromQuery] string? genre, [FromQuery] int? year)
        {
            Query query = _mediaItemsCollection;
            if (!string.IsNullOrEmpty(type)) query = query.WhereEqualTo("Type", type);
            if (!string.IsNullOrEmpty(genre)) query = query.WhereEqualTo("Genre", genre);
            if (year.HasValue) query = query.WhereEqualTo("Year", year.Value);

            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            
            var mediaItems = snapshot.Documents.Select(doc => MapDocumentToMediaItemDto(doc)).ToList();

            return Ok(mediaItems);
        }

        // GET: api/media/random?type=Movie
        [HttpGet("random")]
        public async Task<ActionResult<MediaItemDto>> GetRandom([FromQuery] string type)
        {
            var query = _mediaItemsCollection.WhereEqualTo("Type", type).Limit(100);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();

          
            var filtered = snapshot.Documents.Select(doc => MapDocumentToMediaItemDto(doc)).ToList();

            if (!filtered.Any()) return NotFound();

            var rand = new System.Random();
            return Ok(filtered[rand.Next(filtered.Count)]);
        }

        // POST: api/media 
        [HttpPost]
        public async Task<ActionResult<MediaItemDto>> Create([FromBody] CreateMediaItemDto dto)
        {
            var now = Timestamp.GetCurrentTimestamp(); 

            var itemDataDictionary = new Dictionary<string, object>
            {
                { "Title", dto.Title },
                { "Type", dto.Type },
                { "Creator", dto.Creator },
                { "DateAdded", now }
            };

            if (dto.Genre != null) 
            {
                itemDataDictionary.Add("Genre", dto.Genre);
            }
            if (dto.Year.HasValue)
            {
                itemDataDictionary.Add("Year", dto.Year.Value);
            }

            DocumentReference docRef = await _mediaItemsCollection.AddAsync(itemDataDictionary);

            var createdDto = new MediaItemDto
            {
                Id = docRef.Id,
                Title = dto.Title,
                Type = dto.Type,
                Creator = dto.Creator,
                Genre = dto.Genre,
                Year = dto.Year,
                DateAdded = now
            };

            return CreatedAtAction(nameof(GetAll), new { id = createdDto.Id }, createdDto);
        }

        // PUT: api/media/{id} 
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateMediaItemDto dto)
        {
            DocumentReference docRef = _mediaItemsCollection.Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists) return NotFound();

            Dictionary<string, object> updates = new Dictionary<string, object>();
            if (dto.Title != null) updates.Add("Title", dto.Title);
            if (dto.Type != null) updates.Add("Type", dto.Type);
            if (dto.Creator != null) updates.Add("Creator", dto.Creator);
            if (dto.Genre != null) updates.Add("Genre", dto.Genre);
            if (dto.Year.HasValue) updates.Add("Year", dto.Year.Value);

            if (updates.Any())
            {
                await docRef.UpdateAsync(updates);
            }

            return NoContent();
        }

        // DELETE: api/media/{id} 
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            DocumentReference docRef = _mediaItemsCollection.Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists) return NotFound();
            await docRef.DeleteAsync();
            return NoContent();
        }
    }
}
