import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/services/assignments.services.dart';
import 'package:hms_frontend/services/order.services.dart';
import 'package:hms_frontend/services/submissions.services.dart';
import 'package:hms_frontend/services/video.services.dart';
import 'package:intl/intl.dart';

class StudentViewSubmissionsPage extends StatefulWidget {
  const StudentViewSubmissionsPage({
    super.key, 
    required this.stuEmail,
    required this.isAdminviewer});

  final bool isAdminviewer;
  final String stuEmail;

  @override
  State<StudentViewSubmissionsPage> createState() => _SubmissionsPageState();
}

class _SubmissionsPageState extends State<StudentViewSubmissionsPage> {
  bool showVideoPlayer = false;
  bool isLoading = true;
  List<Map<String, dynamic>> submissions = [];
  bool isLatestOrder = true;
  

  @override
  void initState() {
    super.initState();
    _getSubmissions(); //populate assignments list
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(
        titleText: "My Submissions",
        backgroundColor: Colors.lightBlue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _toggleOrder,
                    icon: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 600),
                      transitionBuilder:
                          (Widget child, Animation<double> animation) {
                        return RotationTransition(
                          turns: child.key == const ValueKey('latest')
                              ? Tween<double>(begin: 0, end: 1)
                                  .animate(animation)
                              : Tween<double>(begin: 0.5, end: 1)
                                  .animate(animation),
                          child:
                              FadeTransition(opacity: animation, child: child),
                        );
                      },
                      child: Icon(
                        color: Colors.white,
                        isLatestOrder
                            ? Icons.arrow_downward_outlined
                            : Icons.arrow_upward_outlined,
                        key: ValueKey(isLatestOrder ? 'latest' : 'earliest'),
                      ),
                    ),
                    label: Text(
                      isLatestOrder ? "Order By: Latest" : "Order By: Earliest",
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.w700),
                    ),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple),
                  ),
                ),
              ],
            ),
            Expanded(
              child: Center(
                child: isLoading
                    ? const CircularProgressIndicator()
                    : submissions.isEmpty
                        ? const Text(
                            'No submissions available.',
                            style:
                                TextStyle(fontSize: 16, color: Colors.black54),
                          )
                        : ListView.builder(
                            itemCount: submissions.length,
                            itemBuilder: (context, index) {
                              final sub = submissions[index];
                              String? mark = sub['grade']?.toString() ?? 'N/A';
                              String date = DateFormat('yMMMd').add_jm().format(
                                  DateTime.parse(sub['submission_Date']));

                              return FutureBuilder<String>(
                                future: getAssignmentTitle(sub['assignm_Num']),
                                builder: (context, snapshot) {
                                  String title = snapshot.data ?? 'Loading...';

                                  return Card(
                                    elevation: 10,
                                    color: Colors.teal[50],
                                    margin: const EdgeInsets.symmetric(
                                        vertical: 8.0),
                                    child: ListTile(
                                      title: Text(
                                        title,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w900,
                                          fontSize: 14,
                                          color: Colors.black,
                                        ),
                                      ),
                                      subtitle: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          const SizedBox(height: 8),
                                          Text(
                                            'Feedback: ${sub['feedback']?.toString() ?? 'No feedback'}',
                                            style: const TextStyle(
                                              color: Colors.black54,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            'Mark: $mark',
                                            textAlign: TextAlign.left,
                                            style: const TextStyle(
                                              fontSize: 12,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            date,
                                            style: const TextStyle(
                                              fontSize: 11,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ],
                                      ),
                                      // Conditionally add the delete button
                                      trailing: widget.isAdminviewer
                                          ? IconButton(
                                              icon: const Icon(
                                                Icons.delete,
                                                color: Colors.red,
                                              ),
                                              onPressed: () async { 
                                                 _deleteSubmission(widget.stuEmail, sub['assignm_Num'], index, sub['content']);
                                              },
                                            )
                                          : null,
                                    ),
                                  );
                                },
                              );
                            },
                          ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _getSubmissions() async {
    try {
      final List<Map<String, dynamic>> fetchedSubmissions =
          await SubmissionServices().fetchStudentSubmissions(widget.stuEmail);

      setState(() {
        submissions = fetchedSubmissions;
        isLoading = false;
        _sortSubmissions();
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      throw "$e";
    }
  }

  void _toggleOrder() {
    setState(() {
      isLatestOrder =
          !isLatestOrder; //if false, become true. If true, become false
      _sortSubmissions();
    });
  }

  void _sortSubmissions() {
    if (isLatestOrder) {
      submissions = OrderServices.sortSubmissionsLatest(
          submissions); //Order by descending
    } else {
      submissions = OrderServices.sortSubmissionsEarliest(
          submissions); //Order by ascending
    }
  }

  Future<String> getAssignmentTitle(int assignmNum) async {
    Map<String, dynamic>? assignment =
        await AssignmentService().fetchSpecificAssignment(assignmNum);
    if (assignment != null) {
      return assignment['title'];
    } else {
      throw Exception('Error');
    }
  }

 void _deleteSubmission(String sEmail, int assignmNum, int index, String? url) async {
  // Show a confirmation dialog before deleting
  bool? action = await showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: const Text('Delete submission AND video from storage'),
        content: const Text('Are you sure you want to delete this submission + video, this action cannot be undone?'),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(false); //Stop
            },
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(true); // Proceed
            },
            child: const Text('Delete'),
          ),
        ],
      );
    },
  );

  //if user wants to delete
  if (action == true) {
    bool flag = await SubmissionServices.deleteSubmission(sEmail, assignmNum);
    bool flagB = true;

    if (url!=null){
      //if there is a video, delete it from AWS S3
      flagB = await VideoServices.deleteVideo(url);
    }
    if (flag && flagB) {
      setState(() {
        submissions.removeAt(index);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Submission + Video deleted successfully')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to delete submission')),
      );
    }
  }
}
}
