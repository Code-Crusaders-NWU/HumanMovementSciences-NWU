class OrderServices {
  
  //Function to order submissions by Latest date
 static List<Map<String, dynamic>> sortSubmissionsLatest(List<Map<String, dynamic>> submissions) {
  submissions.sort((a, b) {
    final dateA = DateTime.parse(a['submission_Date']);
    final dateB = DateTime.parse(b['submission_Date']);
    return dateB.compareTo(dateA); // Descending order
  });
  return submissions;
}
  //Function to order submissions by Earliest date
  static List<Map<String, dynamic>> sortSubmissionsEarliest(List<Map<String, dynamic>> submissions) {
    submissions.sort((a, b) {
      final dateA = DateTime.parse(a['submission_Date']);
      final dateB = DateTime.parse(b['submission_Date']);
      return dateA.compareTo(dateB); 
    });
    return submissions;
  }

  static List<Map<String, dynamic>> sortAssignmentsEarliest(List<Map<String, dynamic>> assignments) {
    assignments.sort((a, b) {
      final dateA = DateTime.parse(a['due_date']);
      final dateB = DateTime.parse(b['due_date']);
      return dateA.compareTo(dateB); 
    });
    return assignments;
  }
}