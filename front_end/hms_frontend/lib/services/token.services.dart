import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class TokenService {
  final storage = FlutterSecureStorage();

  Future<void> storeToken(String token) async {
  await storage.write(key: 'jwt_token', value: token);
}
  //Securely Retreive JWT token
 Future<String?> getToken() async {
  return await storage.read(key: 'jwt_token');
}
  //Check if Token is expired
bool isTokenExpired(String token) {
  return JwtDecoder.isExpired(token);
}
  // Check if the JWT token exists
  Future<bool> hasToken() async {
    String? token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
