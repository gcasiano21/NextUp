public class InsertReportItemDto
{
    public string MediaTitle { get; set; } = string.Empty;
    public string? Issue { get; set; }
    public string? CorrectVersion { get; set; }
}

public class ReportItemDto : InsertReportItemDto
{
    public string Id { get; set; } = string.Empty;
    public Google.Cloud.Firestore.Timestamp DateAdded { get; set; }
}