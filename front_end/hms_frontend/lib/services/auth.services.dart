
import 'package:jwt_decoder/jwt_decoder.dart';

class AuthServices{

 static Future <String> getRole(String token) async{
  Map<String, dynamic> decodeToken = JwtDecoder.decode(token);
  String role = decodeToken['user_type'];

  if (decodeToken.isNotEmpty){
    return role;
  }
  return "none";
}
}