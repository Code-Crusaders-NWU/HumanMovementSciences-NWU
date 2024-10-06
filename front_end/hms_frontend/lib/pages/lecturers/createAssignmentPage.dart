import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';

class AssignmentCreatePage extends StatefulWidget {
  const AssignmentCreatePage({super.key});

  @override
  State<AssignmentCreatePage> createState() => _AssignmentsPageState();
}

class _AssignmentsPageState extends State<AssignmentCreatePage> {
  TimeOfDay timeDue = TimeOfDay.now();  //Used to determine time an assignment is due
  
  final lecturerController = TextEditingController();
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Assignments',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.deepPurple,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Center(child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          
          children: <Widget>[

            TextBox(
                controller: titleController,
                hintText: 'Email of Lecturer',
                obscureText: false,
              ),

              const SizedBox(height: 20), //Used for spacing
            
            TextBox(
                controller: titleController,
                hintText: 'Title of Assignment',
                obscureText: false,
              ),

              const SizedBox(height: 20), //Used for spacing

              TextBox(
                controller: descriptionController,
                hintText: 'Description of Assignment',
                obscureText: false,
              ),

              const SizedBox(height: 20), //Used for spacing
              
              //Get the time an assignment is due
              ElevatedButton(onPressed: () async {
                final TimeOfDay? timeOfDay = await showTimePicker(context: context, 
                initialTime: timeDue,
                initialEntryMode: TimePickerEntryMode.dial);
                if (timeOfDay !=null){
                  setState(() {
                    timeDue = timeOfDay;
                  });
                }
              }, child: const Row(
                mainAxisSize: MainAxisSize.min,   //Only fit all children
                children: [
                  Text('Choose Due Time'),
                  Icon(Icons.hourglass_bottom),
                ],
              ),
              ),
              
              const SizedBox(height: 20), //Used for spacing
              
              MyButton(text: 'Create Assignment', onPressed: (){

              })



          ],
        ),), 
    ),
    );
  }
}