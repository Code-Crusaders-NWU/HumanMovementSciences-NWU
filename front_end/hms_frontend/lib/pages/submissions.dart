import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/students/studentSubmissionPage.dart';
import 'package:intl/intl.dart';
import 'package:hms_frontend/services/submissions.services.dart'; 

class SubmissionsPage extends StatefulWidget {
  const SubmissionsPage({super.key,
  required this.assignNumb
  }
  );

  final int assignNumb;

  @override
  State<SubmissionsPage> createState() => _SubmissionsPageState();
}

class _SubmissionsPageState extends State<SubmissionsPage> {
  List<Map<String, dynamic>> submissions = []; // to store submissions from an assignment
   bool isLoading = true;
  @override
  void initState() {
    super.initState();
    fetchSubmissions();
  }

  void fetchSubmissions() async {
    try {
      final List<Map<String, dynamic>> fetchedAssignments =
          await SubmissionServices().fetchAssignmentSubmissions(widget.assignNumb); 
      setState(() {
        submissions = fetchedAssignments;
        isLoading = false;
      });
    } catch (e) {
      print('Error fetching assignments: $e');
     
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Submissions',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.deepPurple,
      ),


      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          
          child: isLoading ? const CircularProgressIndicator()
          : submissions.isEmpty
            ? const Text(
                      'No submissions available.',
                      style: TextStyle(fontSize: 16, color: Colors.black54),
                    ) 
          : ListView.builder(
            itemCount: submissions.length,
            itemBuilder: (context, index) {
              final sub = submissions[index];
              String? mark = sub['grade'].toString();
              String date = DateFormat('yMMMd')
                  .add_jm()
                  .format(DateTime.parse(sub['submission_Date']));

              return Card(
                elevation: 10,
                color: Colors.teal[50], // Light blue card background
                margin: const EdgeInsets.symmetric(vertical: 8.0),
                child: ListTile(
                  title: Text(
                    sub['stu_Email'],
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.black,
                    ),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 8), 
                      Text('Mark: ${mark ?? 0}',
                      textAlign: TextAlign.left,
                      style: const TextStyle(
                        fontSize: 12,
                      ),
                      ),
                       const SizedBox(height: 4),
                      Text(
                        'Submission: $date',
                        style: const TextStyle(
                          fontSize: 11,
                          color: Colors.black54,
                        ),
                      ),
                      
                    ],
                  ),
                  trailing: IconButton(
                    icon: const Icon(
                      Icons.arrow_forward,
                      color: Colors.blue,
                    ),
                    onPressed: () {
                      Navigator.push(
                              context,
                              MaterialPageRoute(
                              builder: (context) => StudentSubmissionsPage(
                              stuEmail: sub['stu_Email'],
                              assignmNumb: sub['assignm_Num'],
                              uri: sub['content'],
                              mark: sub['grade']!,
                              feedback: sub['feedback']!,
                              ),                  
                                ));
                    }
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
