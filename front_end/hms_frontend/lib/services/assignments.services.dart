import 'package:hms_frontend/constants.dart';
import 'package:hms_frontend/services/token.services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AssignmentService {

  //Function which receives all due assignments
  Future<List<Map<String, dynamic>>> fetchAssignments() async {
    try {
      final uri = Uri.parse("$apiURL/api/dueAssignments");

      String? token = await TokenService().getToken();
      if (token == null) {
        throw Exception('Token is empty');
      }
      final response = await http.get(uri, headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      });

      if (response.statusCode == 200) {
        Map<String, dynamic> resBody = jsonDecode(response.body);
        List<dynamic> assignmentsJson = resBody['assignments'];
        return assignmentsJson.cast<
            Map<String, dynamic>>(); // Cast to list of Map<String, dynamic>s
      } else {
        throw Exception('Failed to load assignments');
      }
    } catch (e) {
      print('Error fetching assignments: $e');
      return [];
    }
  }

  //Function which returns lecturer Assignments
  Future<List<Map<String, dynamic>>> fetchLecturerAssignments(
      String lecturerEmail) async {
    try {
      final uri =
          Uri.parse("$apiURL/api/assignment?lec_Email=$lecturerEmail");

      String? token = await TokenService().getToken();
      if (token == null) {
        throw Exception('Token is empty');
      }
      final response = await http.get(uri, headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      });

      if (response.statusCode == 200) {
        Map<String, dynamic> resBody = jsonDecode(response.body);
        List<dynamic> assignmentsJson = resBody['assignments'];
        return assignmentsJson.cast<
            Map<String, dynamic>>(); // Cast to list of Map<String, dynamic>s
      } else {
        throw Exception('Failed to load assignments');
      }
    } catch (e) {
      print('Error fetching assignments: $e');
      return [];
    }
  }

  Future<bool> createAssignment(int assignmentNumber, String assignDateTime, String lecturerEmail,
   int total, String dueDateTime, String title, String description) async {
    try {

      print(assignDateTime);
      print(dueDateTime);

      
      final uri = Uri.parse("$apiURL/api/assignment");
      String? token = await TokenService().getToken();

      final response = await http.post(uri, 
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, dynamic>{
          "assignm_Num": assignmentNumber,
          "assignm_Date": assignDateTime,
          "lec_Email": lecturerEmail,
          "grade" : total,
          "due_date" : dueDateTime,
          "title" : title,
          "description" : description,
        }));

        if (response.statusCode == 200){
          return true;
        }
        else{
          var resBody = jsonDecode(response.body);
          print(resBody['error']);
        }
      return false;
    } catch (e) {
      return false;
    }
  }
}
