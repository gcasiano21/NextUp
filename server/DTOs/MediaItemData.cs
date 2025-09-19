using Google.Cloud.Firestore;

namespace Api.Models
{
    public class MediaItemData
    {
        public MediaItemData()
        {
            Title = "";
            Type = "";
            Creator = "";
        }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Creator { get; set; }
        public string? Genre { get; set; } 
        public int? Year { get; set; }
        public Timestamp DateAdded { get; set; }
    }
}
