import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/pages/signup.dart';
import 'package:hms_frontend/constants.dart';
import 'package:http/http.dart' as http;

class LoginScreen extends StatefulWidget {
  LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  String? loginMessage;

  //login function
  void login() async {
    if (usernameController.text.isNotEmpty &&
        passwordController.text.isNotEmpty) {
      //API request's body in json format
      var body = {
        "email": usernameController.text,
        "password": passwordController.text
      };

      try {
        var res = await http.post(
          Uri.parse("$apiURL/api/login"),
          headers: {"Content-Type": "application/json"},
          body: jsonEncode(body),
        );

        if (res.statusCode == 201) {
          setState(() {
            loginMessage = "Login Sucessful";
          });
        } else {
          var res_body = jsonDecode(res.body);
          if (res_body['error'] != null) {
            setState(() {
              loginMessage = res_body['error'];
            });
          } else {
            setState(() {
              loginMessage = "login failed";
            });
          }
        }
      } catch (error) {
        setState(() {
          loginMessage = "$error";
        });
      }
    } else {
      setState(() {
        loginMessage = "Login Failed";
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
        padding: EdgeInsets.all(16.0),
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

              //Login Button
              MyButton(
                text: 'Login',
                onPressed: () => {login()},
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
