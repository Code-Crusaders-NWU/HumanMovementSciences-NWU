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
  //Delete a user's access from the system
  Future <bool> deleteUser(email) async {
    try {
      final uri = Uri.parse("$apiURL/api/user");
      String? token = await TokenService().getToken();
      final response = await http.delete(uri,
      headers: <String, String>{
        'Authorization' : 'bearer $token',
        'content-type' : 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, String>{
        "email" : email
      }));

      if (response.statusCode == 200){
        
        return true;
      }
      else{
        var resBody = jsonDecode(response.body);
        print(resBody['error']);
        return false;
      }
    } catch (e) {
      throw e.toString();
    }
  }
  //create a lecturer's login information

  Future <dynamic> signUp(String email, String password, String role, String name,  String surname, String title, String degree) async{
    try {

      print(role);
          var regBody = {
          "email": email,
          "password": password,
          "user_type": role,
          "name" : name,
          "surname" : surname,
          "title" : title,
          "degree" : degree,
          };
          var res = await http.post(
            Uri.parse("$apiURL/api/signup"),
            headers: {"Content-Type": "application/json"},
            body: jsonEncode(regBody),
          );

          if (res.statusCode == 201) {
            return true;
            }
          else {
            var resBody = jsonDecode(res.body);
            print(resBody['error']);
            return resBody['error'];
            }
          }
        catch (error) {
          return error.toString();
        }
  }
}