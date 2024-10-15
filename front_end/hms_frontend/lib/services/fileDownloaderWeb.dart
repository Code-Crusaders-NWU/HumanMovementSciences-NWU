import 'dart:html' as html;

void downloadFile(String title, List<int> bytes) {
  final blob = html.Blob([bytes], 'text/csv');
  final url = html.Url.createObjectUrlFromBlob(blob);
  final anchor = html.AnchorElement(href: url)
    ..setAttribute("download", "$title _marks.csv")
    ..click();
  html.Url.revokeObjectUrl(url);
}