import 'package:flutter/material.dart';
import 'package:hms_frontend/components/videoPlayer.dart';
import 'package:video_player/video_player.dart';

class StudentSubmissionsPage extends StatefulWidget {
  const StudentSubmissionsPage({super.key});

  @override
  State<StudentSubmissionsPage> createState() => _SubmissionsPageState();
}

class _SubmissionsPageState extends State<StudentSubmissionsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar( title: const Text('Video Players'),
      
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          VideoPlayerWidget(
          url: 'assets/tractor.mp4', 
          dataSourceType: DataSourceType.asset
          ),
          SizedBox(height: 24,
          ),
        ],
      ),
    );
  }
}