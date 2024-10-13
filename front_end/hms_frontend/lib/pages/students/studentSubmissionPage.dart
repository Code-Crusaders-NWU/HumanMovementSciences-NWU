import 'package:flutter/material.dart';
import 'package:hms_frontend/components/markingCard.dart';
import 'package:hms_frontend/components/videoPlayer.dart';
import 'package:video_player/video_player.dart';

class StudentSubmissionsPage extends StatefulWidget {
   StudentSubmissionsPage({
    super.key,
    required this.stuEmail,
    required this.assignmNumb,
    //required this.videoNumb,
    required this.uri,
    required this.mark,
    required this.feedback
    });
  
  final String stuEmail;
  final int assignmNumb;
  //final int videoNumb;
  final String uri;
  int? mark;
  String? feedback;
  @override
  State<StudentSubmissionsPage> createState() => _SubmissionsPageState();
}

class _SubmissionsPageState extends State<StudentSubmissionsPage> {
  bool _showVideoPlayer = false; // New flag to control when to show the video player
  bool _showGradingFeedback = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Student Video Submission',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.deepPurple,
        elevation: 4.0,
      ),
      body: ListView(
         
        padding: const EdgeInsets.all(20),
        children: [
          // Button to manually load and display the video player
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
                SizedBox(
              width: 200,
              child: ElevatedButton.icon(
                        onPressed: (){
                          if (_showVideoPlayer){
                            setState(() {
                            _showVideoPlayer = false;
                            });
                          }else{
                            setState(() {
                            _showVideoPlayer = true;
                          });
                          }
                        },
                        icon: const Icon(Icons.download, color: Colors.white),
                        label: const Text(
                          'Toggle Video Player',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                          backgroundColor:
                           Colors.blueAccent,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30.0),
                          ),
                        ),
                      ),
            ),

            SizedBox(
              width: 175,
              child: ElevatedButton.icon(
                         onPressed: (){
                          if (_showGradingFeedback){
                            setState(() {
                            _showGradingFeedback = false;
                            });
                          }else{
                            setState(() {
                            _showGradingFeedback = true;
                          });
                          }
             
                        },
                        icon: const Icon(Icons.mark_chat_read_sharp, color: Colors.white),
                        label: const Text(
                          'Toggle Grading Sheet',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                          backgroundColor:
                           Colors.deepPurple,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                        ),
                      ),
            ),
            ],
          ),
          
          const SizedBox(height: 24),

          // Show MarkingWidget if grading feedback is enabled
          _showGradingFeedback
              ? MarkingWidget(
                  grade: widget.mark!,
                  feedback: widget.feedback!,
                  stuEmail: widget.stuEmail,
                  assignNum: widget.assignmNumb,
                  total: 100,
                )
              : const SizedBox(), //Empty when Grading is not shown
          
          // Show the video player only if the button was pressed
          _showVideoPlayer
              ? VideoPlayerWidget(
                  url: widget.uri,
                  dataSourceType: DataSourceType.network,
                  placeholderImage: 'assets/nwulogo.png',
                )
              : const SizedBox(), // Empty container when video player is not shown
        ],
      ),
    );
  }
}
