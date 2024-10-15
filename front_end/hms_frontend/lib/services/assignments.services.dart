import 'dart:io';
import 'package:file_picker/file_picker.dart';
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
  //Function to create an assignment for an assignment
  Future<bool> createAssignment( String assignDateTime, String lecturerEmail,
   int total, String dueDateTime, String title, String description) async {
    try {
      final uri = Uri.parse("$apiURL/api/assignment");
      String? token = await TokenService().getToken();

      final response = await http.post(uri, 
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, dynamic>{
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
  //Function to download marks for an assignment
  Future <bool> downloadMarks(int assignmentNumber, String title) async {
    try {
      final uri = Uri.parse("$apiURL/api/download_marks/$assignmentNumber");
      String? token = await TokenService().getToken();
      
      final response =await http.get(uri,
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      );

      if (response.statusCode==200){
        String? outFile = await FilePicker.platform.saveFile(
          dialogTitle: 'Store marks:',
          fileName: '$title _marks',
          type: FileType.custom,
          allowedExtensions: ['csv'], //can only store csv files
        );

        File file = File(outFile!);
        await file.writeAsBytes(response.bodyBytes);
      
        return true;
      }

      return false;      
    } catch (e) {
      throw e.toString();
    }
  }
  //Function to delete a student's assignment using their assignmentID
  Future <bool> deleteAssignment(int assignmentID) async{
    try {
      final uri = Uri.parse("$apiURL/api/assignment");
      String? token = await TokenService().getToken();

      final response = await http.delete(uri,
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String,dynamic>{
        "assignm_Num" : assignmentID
      })
      );
      if (response.statusCode == 200){
        return true;
      }
      else{
        return false;
      }
      
    } catch (e) {
      throw e.toString();
    }
  }

Future<Map<String, dynamic>?> fetchSpecificAssignment(int assignNumb) async {
  try {
    final uri = Uri.parse("$apiURL/api/assignment/$assignNumb");

    String? token = await TokenService().getToken();
    final response = await http.get(uri, headers: <String, String>{
      'Authorization': 'bearer $token',
      'Content-Type': 'application/json; charset=UTF-8'
    });

    if (response.statusCode == 200) {
      Map<String, dynamic> resBody = jsonDecode(response.body);
      
      // Check if there's an assignment in the response
      if (resBody.containsKey('assignment')) {
        Map<String, dynamic> assignment = resBody['assignment'];

        return assignment; // Return the assignment object
      } else {
        throw Exception('Assignment not found');
      }
    } else {
      throw Exception('Failed to load assignment');
    }
  } catch (e) {
    return null;
  }
}
}
