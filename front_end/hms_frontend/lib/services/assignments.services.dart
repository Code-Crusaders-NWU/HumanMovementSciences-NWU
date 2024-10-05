import 'package:hms_frontend/constants.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hms_frontend/services/auth.services.dart';
import 'package:hms_frontend/services/token.services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AssignmentService{

  Future<List<Map<String, dynamic>>> fetchAssignments() async {
    try {
      final uri = Uri.parse("$apiURL/api/dueAssignments");
      
      String? token = await TokenService().getToken();
      if (token == null){
        throw Exception('Token is empty');
      }
      final response = await http.get(uri,
      headers: <String,String>{
        'Authorization' : 'bearer $token',
        'Content-Type'  : 'application/json; charset=UTF-8'
      });

      if (response.statusCode == 200)
      {
        Map<String, dynamic> resBody = jsonDecode(response.body);
        List<dynamic> assignmentsJson = resBody['assignments'];

        return assignmentsJson.cast<Map<String, dynamic>>(); // Cast to list of Map<String, dynamic>s
      }
      else{
        throw Exception('Failed to load assignments');
      }
    } catch (e) {
      print('Error fetching assignments: $e');
      return [];
    }
  }
  }
