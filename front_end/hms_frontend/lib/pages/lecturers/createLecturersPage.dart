import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/services/users.services.dart';

class CreateLecturersPage extends StatefulWidget {
  const CreateLecturersPage({super.key});

  @override
  State<CreateLecturersPage> createState() => _CreatelecturerspageState();
}

class _CreatelecturerspageState extends State<CreateLecturersPage> {

//Controllers for textfields
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final nameController = TextEditingController();
  final surnameController = TextEditingController();
  final titleController = TextEditingController();
  final degreeController = TextEditingController();
  String message = "";


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Add a lecturer',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.deepPurple,
      ),
      body:  Padding(padding: const EdgeInsets.all(8.0),
      child: Center(child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          TextBox(controller: emailController, hintText: 'Email Adress', obscureText: false),
          const SizedBox(height: 20),
          TextBox(controller: passwordController, hintText: 'Lecturer Password', obscureText: false),
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
  onPressed: () {
    _createLecturer(emailController.text, passwordController.text, 
    nameController.text, surnameController.text,
     titleController.text, degreeController.text);
  },
  style: ElevatedButton.styleFrom(
    backgroundColor: Colors.deepPurple,
    padding: const EdgeInsets.symmetric(horizontal: 100,vertical: 10)
  ),
  child: const Text('Create Lecturer',
  style: TextStyle(color: Colors.white,
  fontWeight: FontWeight.bold),),
)
      ],
      ),
      ),
      ),
    );
  }

  dynamic _validator(){
    try {
      if(emailController.text.isEmpty){
        return('Email is empty');
      }
      if(passwordController.text.isEmpty){
        return('Password is empty');
      }
      if(nameController.text.isEmpty){
        return('Name field is empty');
      }
      if(surnameController.text.isEmpty){
        return('Surname field is empty');
      }
      if(titleController.text.isEmpty){
        return('Title is empty');
      }
      if(degreeController.text.isEmpty){
        return('Degree field is empty');
      }
      
      return true;
    } catch (e) {
      throw e.toString();
    }
  }

  Future <bool> _createLecturer(email,password,name, surname, title,degree) async {
    try {
      var validate = _validator();

      if (validate == true){

        //Returns true if both the user's credentials were stored
        bool flag1 = await UserService().createLecturerUser(email, password);
        bool flag2 = (await UserService().createLecturer(email, name, surname, title, degree));
        if (flag1 && flag2){
          clearInput();
          return true;
        }
        else{
          print('error while creating lecturer');
        }
      }
      else{
        setState(() {
          message = validate.toString();  //Have to cast validate toString because it is a dynamic variable
        });
      }
      return true;
    } catch (e) {
      throw e.toString();
    }
  }

  void clearInput(){
    emailController.text = "";
    passwordController.text = "";
    nameController.text = "";
    surnameController.text = "";
    titleController.text = "";
    degreeController.text = "";
  }
}