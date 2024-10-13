import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/services/assignments.services.dart';
import 'package:intl/intl.dart';

class AssignmentCreatePage extends StatefulWidget {
  const AssignmentCreatePage({super.key});

  @override
  State<AssignmentCreatePage> createState() => _AssignmentsPageState();
}

class _AssignmentsPageState extends State<AssignmentCreatePage> {
  TimeOfDay timeDue =
      TimeOfDay.now(); //Used to determine time an assignment is due
  DateTime dueDate = DateTime.now();

  final  _dateController = TextEditingController();
  final  _timeController = TextEditingController();

  final lecturerController = TextEditingController();
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();
  String _errorMessage = "";

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
        child: Center(
          child: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                TextBox(
                  controller: lecturerController,
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
            
                
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 250,
                      child: TextField(
                        controller: _dateController,
                        decoration: const InputDecoration(
                            labelText: 'Pick a due date...',
                            filled: true,
                            prefixIcon: Icon(Icons.calendar_month),
                            enabledBorder:
                                OutlineInputBorder(borderSide: BorderSide.none),
                            focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: Colors.deepPurple))),
                        onTap: () async {
                          await _selectDate();
                        },
                        readOnly: true,
                      ),
                    ),
                    const SizedBox(height: 20),
                    //Get the time an assignment is due
                    Container(
                      width: 250,
                      child: TextField(
                        controller: _timeController,
                        decoration: const InputDecoration(
                            labelText: 'Pick a due time...',
                            filled: true,
                            prefixIcon: Icon(Icons.calendar_month),
                            enabledBorder:
                                OutlineInputBorder(borderSide: BorderSide.none),
                            focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: Colors.deepPurple))),
                        onTap: () async {
                          await _selectTime();
                        },
                        readOnly: true,
                      ),
                    ),
                  ],
                ),
            
                const SizedBox(height: 20), //Used for spacing
            
            
                MyButton(text: 'Create Assignment', onPressed: () {
                  _createAssignment( lecturerController.text, 100, titleController.text, descriptionController.text);
            
                },
                icon: Icon(Icons.add),
                buttonColor: Colors.blue,)
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _selectDate() async {
    DateTime? pickedDate = await showDatePicker(
        context: context,
        firstDate: DateTime.now(),
        lastDate: DateTime(2100),
        initialDate: DateTime.now());

    setState(() {
      dueDate = pickedDate!;
      _dateController.text = pickedDate.toString().split(" ")[0];
    });
    }

  Future<void> _selectTime() async {
    final TimeOfDay? timeOfDay = await showTimePicker(
        context: context,
        initialTime: timeDue,
        initialEntryMode: TimePickerEntryMode.dial);
    if (timeOfDay != null ) {
      setState(() {
        _timeController.text = timeOfDay.toString();
        timeDue = timeOfDay;
      });
    }
  }

  Future <void> _createAssignment(String lecturerEmail,
   int total, String title, String description) async{
      try {
        if (_validator()){
        DateTime now = DateTime.now().toLocal();
        String formattedDate = DateFormat("yyyy-MM-ddTHH:mm:ss'Z'").format(now);
        DateTime dDate = combineDateAndTime(dueDate, timeDue).toUtc();

        String dueDateFinal = formatDate(dDate); // Format dates correctly
          
        bool aStatus = await AssignmentService().createAssignment(formattedDate, 
                                                lecturerEmail, total, dueDateFinal,
                                                  title, description);

          if(aStatus) {
            setState(() {
            _errorMessage = "Assignment Created Successfully";
            lecturerController.clear();
            titleController.clear();
            descriptionController.clear();
            _dateController.clear();
            _timeController.clear();
            
          });
          }
        }
        else{
          throw Exception('Cannot create assignment');
        }
        
      } catch (e) {
        throw "$e.message";
      }
  }

  bool _validator(){
    if (lecturerController.text.isEmpty) {
      setState(() {
        _errorMessage = "Lecturer email is empty";
        
      });
      return false;
    }//lecturer if

    if (titleController.text.isEmpty){
      setState(() {
        _errorMessage = "Title field is empty";
      });
      return false;
    }

    if(descriptionController.text.isEmpty){
      setState(() {
        _errorMessage = "Description field is empty";
      });
      return false;
    }
    
    if(_dateController.text.isEmpty){
      setState(() {
        _errorMessage = "Due date is empty";
      });
      return false;
    }
    if(_timeController.text.isEmpty){
      setState(() {
        _errorMessage = "Due time is empty";
      });
      return false;
    }

    return true;

  }//validator 

  String formatDate(DateTime date) {
  return date.toUtc().toIso8601String().replaceFirst(RegExp(r'\.\d{3}Z$'), 'Z');
}
  DateTime combineDateAndTime(DateTime date, TimeOfDay time) {
  return DateTime(date.year, date.month, date.day, time.hour, time.minute);
}


}
