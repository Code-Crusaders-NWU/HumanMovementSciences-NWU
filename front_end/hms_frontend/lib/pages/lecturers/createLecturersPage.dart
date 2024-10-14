import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/services/users.services.dart';
import 'package:hms_frontend/services/validator.services.dart';

class CreateLecturersPage extends StatefulWidget {
  const CreateLecturersPage({super.key});

  @override
  State<CreateLecturersPage> createState() => _CreateLecturersPageState();
}

class _CreateLecturersPageState extends State<CreateLecturersPage> {
  // Controllers for textfields
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final cPasswordController = TextEditingController();
  final nameController = TextEditingController();
  final surnameController = TextEditingController();
  final titleController = TextEditingController();
  final degreeController = TextEditingController();
  String message = "";
  Color messageColor = Colors.red; 

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(
        titleText: "Add a lecturer",
        backgroundColor: Colors.lightBlue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextBox(controller: emailController, hintText: 'Email Address', obscureText: false),
              const SizedBox(height: 20),
              TextBox(controller: passwordController, hintText: 'Lecturer Password', obscureText: true),
              const SizedBox(height: 20),
              TextBox(controller: cPasswordController, hintText: 'Confirm Password', obscureText: true),
              const SizedBox(height: 20),
              TextBox(controller: nameController, hintText: 'First Name', obscureText: false),
              const SizedBox(height: 20),
              TextBox(controller: surnameController, hintText: 'Surname', obscureText: false),
              const SizedBox(height: 20),
              TextBox(controller: titleController, hintText: 'Title e.g. Dr.', obscureText: false),
              const SizedBox(height: 20),
              TextBox(controller: degreeController, hintText: 'Degree', obscureText: false),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () async {
                  bool success = await _createLecturer(
                    emailController.text,
                    passwordController.text,
                    nameController.text,
                    surnameController.text,
                    titleController.text,
                    degreeController.text,
                  );

                  if (success) {
                    setState(() {
                      message = "Lecturer created successfully!";
                      messageColor = Colors.green; 
                    });
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  padding: const EdgeInsets.symmetric(horizontal: 100, vertical: 10),
                ),
                child: const Text(
                  'Create Lecturer',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 20),
              if (message.isNotEmpty)
                Text(
                  message,
                  style: TextStyle(color: messageColor, fontWeight: FontWeight.bold), 
                ),
            ],
          ),
        ),
      ),
    );
  }

  dynamic _validator() {
    String? email = emailController.text;
    var valEmail = ValidatorService.validateEmail(email);
    
    if (valEmail != true) {
      return valEmail; 
    }

    var valPassword = ValidatorService.validatePasword(passwordController.text,cPasswordController.text);
    if (valPassword != true) {
      return valPassword;
    }

    var valName = ValidatorService.validateNames(nameController.text, surnameController.text);
    if (valName != true) {
      return valName;
    }

    var valTitle = ValidatorService.validateTitle(titleController.text);
    if (valTitle != true) {
      return valTitle;
    }
    if (degreeController.text.isEmpty) {
      return 'Degree field is empty';
    }

    return true; 
  }

  Future<bool> _createLecturer(
    String email,
    String password,
    String name,
    String surname,
    String title,
    String degree,
  ) async {
    try {
      var validate = _validator();

      if (validate == true) {
       
        bool flag1 = await UserService().createLecturerUser(email, password);
        bool flag2 = await UserService().createLecturer(email, name, surname, title, degree);
        
        if (flag1 && flag2) {
          clearInput();
          return true;
        } else {
          setState(() {
            message = 'Error while creating lecturer';
            messageColor = Colors.red; 
          });
        }
      } else {
        setState(() {
          message = validate.toString(); 
          messageColor = Colors.red; 
        });
      }
      return false; 
    } catch (e) {
      setState(() {
        message = 'Error: ${e.toString()}'; 
        messageColor = Colors.red; 
      });
      return false;
    }
  }

  void clearInput() {
    emailController.clear();
    passwordController.clear();
    cPasswordController.clear();
    nameController.clear();
    surnameController.clear();
    titleController.clear();
    degreeController.clear();
  }
}
