import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hms_frontend/services/submissions.services.dart';

class MarkingWidget extends StatefulWidget {
  const MarkingWidget({
    super.key,
    required this.grade,
    required this.feedback,
    required this.stuEmail,
    required this.assignNum,
    required this.total,
  });

  final int? grade;
  final String? feedback;
  final String stuEmail;
  final int assignNum;
  final int total;
  @override
  State<MarkingWidget> createState() => _MarkingWidgetSate();
}

class _MarkingWidgetSate extends State<MarkingWidget> {
  final TextEditingController _gradeController = TextEditingController();
  final TextEditingController _feedbackController = TextEditingController();
  String _statusMessage = "";

  @override
  void initState() {
    super.initState();
    _gradeController.text = widget.grade?.toString() ?? '';
    _feedbackController.text = widget.feedback ?? '';
  }

  @override
  void dispose() {
    _gradeController.dispose();
    _feedbackController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Card(
        elevation: 8.0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(5.0),
        ),
        color: Colors.white,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Marking Sheet',
                style: TextStyle(
                    fontSize: 20,
                    color: Colors.black54,
                    fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: _gradeController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Grade',
                  border: OutlineInputBorder(),
                ),
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                ],
              ),
              const SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 200,
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        _resetMessage();
                        String? gradeInput = _gradeController.text;
                        var gradeStatus = gradeValidation(gradeInput, 100);

                        if (gradeStatus!=true) {
                          setState(() {
                            _statusMessage = gradeStatus;
                          });
                        } 
                        else 
                        {
                          bool result = await gradeStudent(widget.assignNum,
                              widget.stuEmail, int.parse(gradeInput));
                          if (result) {
                            setState(() {
                              _statusMessage = "Successfully graded student";
                              _gradeController.clear();
                            });
                          } else {
                            setState(() {
                              _statusMessage = "Grade assignment failed";
                            });
                          }
                        }
                      },
                      icon: const Icon(Icons.calculate, color: Colors.white),
                      label: const Text(
                        'Grade Submission',
                        style: TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 15),
                        backgroundColor: Colors.blueAccent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: _feedbackController,
                decoration: InputDecoration(
                  labelText: 'Feedback',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 200,
                    child: ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.draw, color: Colors.white),
                      label: const Text(
                        'Provide Feedback',
                        style: TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 15),
                        backgroundColor: Colors.blueAccent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16.0),
              Text(
                _statusMessage,
                style: TextStyle(
                  color: _statusMessage.startsWith("Successfully")
                      ? Colors.green
                      : Colors.red,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _resetMessage() {
    setState(() {
      _statusMessage = "";
    });
  }

  Future<bool> gradeStudent(int assignNumb, String stuEmail, int grade) async {
    dynamic flagB = await SubmissionServices().gradeSubmission(assignNumb, stuEmail, grade);
    return flagB;
  }

  dynamic gradeValidation(String? gradeInput, int total) {
    if (gradeInput == null || gradeInput.isEmpty) {
      return 'Grade field must not be empty!';
    }

    int grade;
    try {
      grade = int.parse(gradeInput);
    } catch (e) {
      return 'Grade must be a valid number!';
    }

    if (grade > total) {
      return 'Grade cannot be higher than the total';
    }

    return true;
  }
}
