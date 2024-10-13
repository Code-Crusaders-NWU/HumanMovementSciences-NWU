import 'dart:convert';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/pages/admins/admin.dart';
import 'package:hms_frontend/pages/home.dart';
import 'package:hms_frontend/pages/lecturers/lecturers.dart';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/pages/signup.dart';
import 'package:hms_frontend/constants.dart';
import 'package:http/http.dart' as http;
import 'package:hms_frontend/services/token.services.dart';
import 'package:hms_frontend/services/auth.services.dart';

class LoginScreen extends StatefulWidget {
  LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TokenService tokenService = TokenService();
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  String? loginMessage;
  bool isLoading = false;

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
        String token = jsonDecode(response.body)['token'];
        await tokenService.storeToken(token);
        return jsonDecode(response.body)['token'];
      } else {
        var resBody = jsonDecode(response.body);
        setState(() {
          loginMessage = resBody['error'];
        });
        return "";
      }
    } catch (e) {
      setState(() {
        loginMessage = 'An error occurred: $e';
      });
      return "";
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(titleText: "Login"),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
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

                Image.asset(
                  'assets/nwu.png',
                  width: 150,
                  height: 150,
                ),
                const SizedBox(height: 5),

                const Text(
                  'Welcome to the Human Movement Sciences Digital Platform',
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    color: Colors.lightBlue,
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
                isLoading
                    ? const CircularProgressIndicator()
                    :
                    //Login Button
                    MyButton(
                        buttonColor: Colors.deepPurple,
                        icon: Icon(Icons.login),
                        text: 'Login',
                        onPressed: () async {
                          String token = await login();
                          String role = await AuthServices.getRole(token);
                          if (role == "admin") {
                            //Ensure there is a token before proceding
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const AdminPage(),
                              ),
                            );
                          } else if (role == "lecturer") {
                            Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const LecturerPage()));
                          } else {
                            Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => HomePage()));
                          }
                        },
                      ),

                const SizedBox(height: 10),
                //SignUp Button
                MyButton(
                  buttonColor: Colors.lightBlue,
                  icon: Icon(Icons.create),
                  text: 'SignUp',
                  onPressed: () {
                    Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                            builder: (context) => SignupScreen()));
                  },
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
