
import 'package:chewie/chewie.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:video_player/video_player.dart';

class StudentSubmissionPage extends StatefulWidget {
  final String studentEmail;
  const StudentSubmissionPage({super.key, required this.studentEmail});

  @override
  State<StudentSubmissionPage> createState() => _StudentsubmissionpageState();
}

class _StudentsubmissionpageState extends State<StudentSubmissionPage> {
  late VideoPlayerController videoPlayerController;
  ChewieController? chewieController;

  @override
  void initState() {
    super.initState();
    _initPlayer();
  }

  void _initPlayer() async {
    // ignore: deprecated_member_use
    videoPlayerController = VideoPlayerController.network(
        'https://humanmovement-bucket.s3.eu-north-1.amazonaws.com/Uploads%2F479a9175-8dbf-4119-81fd-ec79b420fad3-VID-20230903-WA0051.mp4');
    await videoPlayerController.initialize();

    chewieController = ChewieController(
      videoPlayerController: videoPlayerController,
      autoPlay: true,
      looping: true,
      additionalOptions: (context) {
        return <OptionItem>[
          OptionItem(
            onTap: () => debugPrint('Option 1 pressed!'),
            iconData: Icons.chat,
            title: 'Option 1',
          ),
          OptionItem(
            onTap: () =>
                debugPrint('Option 2 pressed!'),
            iconData: Icons.share,
            title: 'Option 2',
          ),
        ];
      },
    );
  }

  @override
  void dispose() {
    videoPlayerController.dispose();
    chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Chewie Video Player"),
      ),
      body: chewieController!=null? Padding(
        padding: EdgeInsets.symmetric(vertical: 20),
        child: Chewie(
          controller: chewieController!,
        ),
      ) : const Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}