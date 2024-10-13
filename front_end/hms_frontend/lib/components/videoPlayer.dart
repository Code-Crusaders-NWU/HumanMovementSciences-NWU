import 'dart:io';
import 'package:chewie/chewie.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class VideoPlayerWidget extends StatefulWidget {
  const VideoPlayerWidget({
    super.key,
    required this.url,
    required this.dataSourceType,
    required this.placeholderImage,
    });

  final String url;
  final DataSourceType dataSourceType;
  final String placeholderImage;
  @override
  State<VideoPlayerWidget> createState() => _VideoPlayerState();
}

class _VideoPlayerState extends State<VideoPlayerWidget> {
  late VideoPlayerController _videoPlayerController;
  late ChewieController _chewieController;
  bool _isVideoInitialized = false;

  @override
  void initState(){
    super.initState();

    switch (widget.dataSourceType){
      case DataSourceType.asset:
        _videoPlayerController = VideoPlayerController.asset(widget.url);
        break;
      case DataSourceType.network:
        _videoPlayerController = VideoPlayerController.network(widget.url);
         break;
      case DataSourceType.file:
        _videoPlayerController = VideoPlayerController.file(File(widget.url));
         break;
      case DataSourceType.contentUri:
        _videoPlayerController = VideoPlayerController.contentUri(Uri.parse(widget.url));
         break;
    }

    _videoPlayerController.initialize().then((_) {
      setState(() {
        _isVideoInitialized = true;
      });
    });

    _chewieController = ChewieController(
      videoPlayerController:  _videoPlayerController,
      aspectRatio: 16 / 9,

    );
  }

  @override
  void dispose(){
    _videoPlayerController.dispose();
    _chewieController.dispose();
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Padding(
        padding: const EdgeInsets.all(16.0), // Add some padding around the text
        child: Text(
          widget.dataSourceType.name.toLowerCase(),
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
        const Divider(),
        Container(
          child: _isVideoInitialized
              ? AspectRatio(
                  aspectRatio: 16 / 9,
                  child: Chewie(
                    controller: _chewieController,
                  ),
                )
              : AspectRatio(
                  aspectRatio: 16 / 9,
                  child: Image.asset( // Placeholder image while the video is loading
                    widget.placeholderImage,
                    fit: BoxFit.cover,
                  ),
                ),
        )
        
      ],
    );
  }
}