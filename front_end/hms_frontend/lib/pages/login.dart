import 'dart:convert';
import 'package:hms_frontend/pages/admin.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/pages/signup.dart';
import 'package:hms_frontend/constants.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LoginScreen extends StatefulWidget {
  LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  String? loginMessage;
  bool isLoading = false;
  final storage = FlutterSecureStorage();
  
  //Securely Store JWT token
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
  //login function
  Future<String> login() async {
    setState(() {
      isLoading = true;
    });
    try {
      final response = await http.post(
        Uri.parse('$apiURL/api/login'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'email': usernameController.text,
          'password': passwordController.text,
        }),
      );

      if (response.statusCode == 200) {
        setState(() {
          loginMessage = 'Login successful';
        });

        return jsonDecode(response.body)['token'];

      } 
      
      else {
        var resBody = jsonDecode(response.body);
        setState(() {
          loginMessage = resBody['error'];
        });
        return "";
      }
    } 
    catch (e) {
      setState(() {
        loginMessage = 'An error occurred: $e';
      });
      return "";
    }finally{
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'LOGIN',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.lightBlue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              if (loginMessage != null)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Text(
                    loginMessage!,
                    style: TextStyle(
                      fontSize: 16,
                      color: loginMessage == 'Login successful'
                          ? Colors.green
                          : Colors.red,
                    ),
                  ),
                ),

              //Text wdiget to display nice message
              const Card(
                elevation: 20,
                color: Colors.lightBlueAccent,
                child: Padding(
                  padding: EdgeInsets.all(15.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      SizedBox(height: 8),
                      Text(
                        'HMS NWU',
                        style: TextStyle(
                          fontSize: 19,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      )
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              //Username TextBox
              TextBox(
                controller: usernameController,
                hintText: 'email',
                obscureText: false,
              ),

              const SizedBox(height: 20),

              //Password TextBox
              TextBox(
                controller: passwordController,
                hintText: 'password',
                obscureText: true,
              ),

              const SizedBox(height: 20),
              isLoading? const CircularProgressIndicator() :
              //Login Button
                MyButton(
                  text: 'Login',
                  onPressed: () async{
                        String token = await login() ;
                        if (token.isNotEmpty){  //Ensure there is a token before proceding
                          await storeToken(token); //Stores the token
                          Navigator.pushReplacement(
                            context, 
                            MaterialPageRoute(builder: (context) => const AdminPage(),
                            ),
                          );
                        }
                      },
                ),

              const SizedBox(height: 10),
              //SignUp Button
              MyButton(
                text: 'SignUp',
                onPressed: () {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => SignupScreen()));
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
