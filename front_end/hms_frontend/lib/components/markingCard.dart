import 'package:flutter/material.dart';

class MarkingWidget extends StatefulWidget {
  const MarkingWidget({
    super.key,
    required this.grade,
    required this.feedback,
    required this.stuEmail,
    required this.assignNum,
    required this.total,
  });

  final int grade;
  final String feedback;
  final String stuEmail;
  final int assignNum;
  final int total;
  @override
  State<MarkingWidget> createState() => _MarkingWidgetSate();
}

class _MarkingWidgetSate extends State<MarkingWidget> {
  final TextEditingController _gradeController = TextEditingController();
  final TextEditingController _feedbackController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _gradeController.text = widget.grade.toString();
    _feedbackController.text = widget.feedback;
  }

  @override
  void dispose() {
    super.dispose();
    _gradeController.dispose();
    _feedbackController.dispose();
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
              ),
              const SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 200,
                    child: ElevatedButton.icon(
                      onPressed: () {},
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
            ],
          ),
        ),
      ),
    );
  }
}
