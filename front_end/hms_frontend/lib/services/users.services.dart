import 'dart:convert';

import 'package:hms_frontend/constants.dart';
import 'package:http/http.dart' as http;
import 'package:hms_frontend/services/token.services.dart';
import 'package:http/http.dart';


class UserService{

  //function for admins to view all assignments only callable in admin page and will also be tested in backend with the JWT token
   Future<List<Map<String, dynamic>>> fetchUsers() async {
    try {
      final uri = Uri.parse("$apiURL/api/allUsers");
      
      String? token = await TokenService().getToken();

      final apiRes = await http.get(uri,
      headers: <String,String> {
        'Authorization' : 'bearer $token',
        'content-type' : 'application/json; charset=UTF-8'
      });


      if (apiRes.statusCode == 200){
         Map<String, dynamic> resBody = jsonDecode(apiRes.body);
         List<dynamic> assignmentsJson = resBody['users'];
        return assignmentsJson.cast<Map<String, dynamic>>();
      }
       else{
        throw Exception('Failed to load users');
      }
    } catch (e) {
      return [];
    }
   
   }
}