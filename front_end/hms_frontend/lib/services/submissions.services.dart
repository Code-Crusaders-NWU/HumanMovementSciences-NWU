import 'package:hms_frontend/constants.dart';
import 'package:hms_frontend/services/token.services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SubmissionServices {

  Future<List<Map<String, dynamic>>> fetchUngradedSubmissions() async {
    try {
      final uri = Uri.parse("$apiURL/api/ungraded");

      String? token = await TokenService().getToken();
      final response = await http.get(uri, headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      });

      if (response.statusCode == 200) {
        Map<String, dynamic> resBody = jsonDecode(response.body);
        List<dynamic> assignmentsJson = resBody['ungradedSubmissions'];
        return assignmentsJson.cast<
            Map<String, dynamic>>(); // Cast to list of Map<String, dynamic>s
      } else {
        throw Exception('Failed to load submissions');
      }
    } catch (e) {
      print('Error fetching assignments: $e');
      return [];
    }
  }
  //method to get the number of assignments a student has completed.
  Future <int> countStudentSubmissions() async{
    try {
      final uri = Uri.parse("$apiURL/api/submission/count");
      String? token = await TokenService().getToken();
      final response = await http.get(uri, headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      });

      if(response.statusCode == 200){
        var resBody = jsonDecode(response.body);
        int count = resBody['submissionCount'];
        return count;
      }
      else{
        throw Exception('Failed to load submission count: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error counting submissions: $e');
    }

  }
  
  Future<bool> provideFeedback(int assignNumb, String stuEmail, String feedback) async {
    try {
      final uri = Uri.parse("$apiURL/api/submission/provide_feedback");
      String? token = await TokenService().getToken();
      final response  =await http.patch(uri,
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, dynamic>{
        "assignm_Num" : assignNumb,
        "stu_email" : stuEmail,
        "feedback" : feedback
      }));

      if (response.statusCode == 200){
        return true;
      }
      return false;
    } catch (e) {
      throw Exception('Unable to provide student feedback, please try again.....');
    }
  }

  Future<dynamic> gradeSubmission(int assignNumb, String stuEmail, int grade) async {
    try {
      final uri = Uri.parse("$apiURL/api/submission/grade_submission");
      String? token = await TokenService().getToken();
      final response  =await http.patch(uri,
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, dynamic>{
        "assignm_Num" : assignNumb,
        "stu_Email" : stuEmail,
        "grade" : grade
      }));

      if (response.statusCode == 200){
        return true;
      }
      else{
        var resBody = jsonDecode(response.body);
        return resBody['error'];
      }
    } catch (e) {
       return ('Exception: $e');
    }
  }

  Future<bool> postSubmission(assignNumb, stuEmail, submissionDate, videoURL) async {
     try {
      print('$assignNumb $stuEmail $submissionDate $videoURL');
      final uri = Uri.parse("$apiURL/api/submission");
      String? token = await TokenService().getToken();
      final response  =await http.post(uri,
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, dynamic>{
        "assignm_Num" : assignNumb,
        "stu_Email" : stuEmail,
        "submission_Date" : submissionDate,
        "content" : videoURL,
        "grade" : null,
        "feedback" : "None"
      }));

      if (response.statusCode == 200){
        return true;
      }
      else{
        var resBody = jsonDecode(response.body);
        String error = resBody['error'];
        print('POST SUB ERROR: $error');
        return false;
      }
    } catch (e) {
      print("POST SUB ERROR: $e");  
      return false;  
    }
  }

  Future<List<Map<String, dynamic>>> fetchAssignmentSubmissions(int assignNum) async {
    try {
      final uri = Uri.parse("$apiURL/api/submission/assignment/$assignNum");

      String? token = await TokenService().getToken();
      final response = await http.get(uri, headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      });

      if (response.statusCode == 200) {
        Map<String, dynamic> resBody = jsonDecode(response.body);
        List<dynamic> assignmentsJson = resBody['submissions'];
        return assignmentsJson.cast<
            Map<String, dynamic>>(); // Cast to list of Map<String, dynamic>s
      } else {
        var resBody = jsonDecode(response.body);
        throw Exception(resBody['error']);
      }
    } catch (e) {
      print('Error fetching assignments: $e');
      return [];
    }
  }
}