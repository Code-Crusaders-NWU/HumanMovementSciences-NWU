

import 'dart:io';

import 'package:chewie/chewie.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class VideoPlayerWidget extends StatefulWidget {
  const VideoPlayerWidget({
    super.key,
    required this.url,
    required this.dataSourceType,
    });

  final String url;
  final DataSourceType dataSourceType;
  @override
  State<VideoPlayerWidget> createState() => _VideoPlayerState();
}

class _VideoPlayerState extends State<VideoPlayerWidget> {
  late VideoPlayerController _videoPlayerController;
  late ChewieController _chewieController;

  void initState(){
    super.initState();

    switch (widget.dataSourceType){
      case DataSourceType.asset:
        _videoPlayerController = VideoPlayerController.asset(widget.url);
      case DataSourceType.network:
        _videoPlayerController = VideoPlayerController.network(widget.url);
      case DataSourceType.file:
        _videoPlayerController = VideoPlayerController.file(File(widget.url));
      case DataSourceType.contentUri:
        _videoPlayerController = VideoPlayerController.contentUri(Uri.parse(widget.url));
    }


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
          child: AspectRatio(aspectRatio: 16 / 9,
          child: Chewie(
            controller: _chewieController,
            ),
            ),
        )
        
      ],
    );
  }
}