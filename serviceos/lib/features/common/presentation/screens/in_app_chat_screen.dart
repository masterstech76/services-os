import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

/// Screen X06, X07, X08, P28, P29: In-App Chat, Media Viewer & Masked VoIP Calling
class InAppChatScreen extends StatefulWidget {
  final String peerName;
  final String peerRole;
  final String peerAvatar;
  final String bookingRef;
  final VoidCallback? onBack;

  const InAppChatScreen({
    super.key,
    this.peerName = 'Assigned Technician',
    this.peerRole = 'Field Service Professional',
    this.peerAvatar = 'assets/images/banner_woman.png',
    this.bookingRef = '',
    this.onBack,
  });

  @override
  State<InAppChatScreen> createState() => _InAppChatScreenState();
}

class _InAppChatScreenState extends State<InAppChatScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isCalling = false;
  int _callSeconds = 0;

  final List<Map<String, dynamic>> _messages = [];

  void _sendMessage() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'isMe': true,
        'text': text,
        'time': 'Just now',
        'isImage': false,
      });
      _msgController.clear();
    });

    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _startVoIPCall() {
    setState(() {
      _isCalling = true;
      _callSeconds = 0;
    });
  }

  void _endVoIPCall() {
    setState(() {
      _isCalling = false;
    });
  }

  @override
  void dispose() {
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppColors.nightSurface : AppColors.daySurface;
    final canvasColor = isDark ? AppColors.nightCanvas : AppColors.dayCanvas;
    final textPrimary = isDark ? AppColors.nightTextPrimary : AppColors.dayTextPrimary;
    final textSecondary = isDark ? AppColors.nightTextSecondary : AppColors.dayTextSecondary;
    final borderColor = isDark ? AppColors.nightBorder : AppColors.dayBorder;

    if (_isCalling) {
      return _buildMaskedCallScreen(isDark, surfaceColor, textPrimary, textSecondary);
    }

    return Scaffold(
      backgroundColor: canvasColor,
      appBar: AppBar(
        backgroundColor: surfaceColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: textPrimary),
          onPressed: widget.onBack ?? () => Navigator.of(context).pop(),
        ),
        titleSpacing: 0,
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundImage: widget.peerAvatar.startsWith('http')
                  ? NetworkImage(widget.peerAvatar) as ImageProvider
                  : AssetImage(widget.peerAvatar),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.peerName,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: textPrimary,
                    ),
                  ),
                  Text(
                    '${widget.peerRole} • ${widget.bookingRef}',
                    style: TextStyle(fontSize: 11, color: textSecondary),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone_in_talk, color: AppColors.verifiedEmerald),
            tooltip: 'Masked VoIP Internet Call',
            onPressed: _startVoIPCall,
          ),
          IconButton(
            icon: Icon(Icons.info_outline, color: textSecondary),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('All numbers masked to protect user privacy.')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Privacy Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
            color: (isDark ? AppColors.nightPrimary : AppColors.dayPrimary).withOpacity(0.08),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.lock, size: 12, color: isDark ? AppColors.nightPrimary : AppColors.dayPrimary),
                const SizedBox(width: 6),
                Text(
                  'End-to-End Encrypted • Private Number Masking Active',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                  ),
                ),
              ],
            ),
          ),

          // Message Thread
          Expanded(
            child: _messages.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.chat_bubble_outline, size: 54, color: textSecondary.withOpacity(0.35)),
                          const SizedBox(height: 14),
                          Text(
                            'No Messages Yet',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: textPrimary),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'End-to-end encrypted direct chat between customer and technician. Type a message below to start.',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 13, color: textSecondary),
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final msg = _messages[index];
                      final isMe = msg['isMe'] as bool;
                      return _buildChatBubble(msg, isMe, isDark, surfaceColor, borderColor, textPrimary, textSecondary);
                    },
                  ),
          ),

          // Input Bar
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: surfaceColor,
              border: Border(top: BorderSide(color: borderColor)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.camera_alt_outlined, color: textSecondary),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Camera picker opened')),
                      );
                    },
                  ),
                  IconButton(
                    icon: Icon(Icons.mic_none_outlined, color: textSecondary),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Hold to record voice memo')),
                      );
                    },
                  ),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: TextField(
                        controller: _msgController,
                        style: TextStyle(fontSize: 14, color: textPrimary),
                        decoration: InputDecoration(
                          hintText: 'Type your message...',
                          hintStyle: TextStyle(fontSize: 13, color: textSecondary),
                          border: InputBorder.none,
                        ),
                        onSubmitted: (_) => _sendMessage(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                      onPressed: _sendMessage,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatBubble(
    Map<String, dynamic> msg,
    bool isMe,
    bool isDark,
    Color surfaceColor,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    final bubbleColor = isMe
        ? (isDark ? AppColors.nightPrimary : AppColors.dayPrimary)
        : (isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9));
    final textColor = isMe ? Colors.white : textPrimary;

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: bubbleColor,
          borderRadius: BorderRadius.circular(16).copyWith(
            bottomRight: isMe ? const Radius.circular(2) : const Radius.circular(16),
            bottomLeft: isMe ? const Radius.circular(16) : const Radius.circular(2),
          ),
        ),
        child: Column(
          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            if (msg['isImage'] == true) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  msg['imageUrl'] as String,
                  height: 140,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 6),
            ],
            Text(
              msg['text'] as String,
              style: TextStyle(fontSize: 14, color: textColor),
            ),
            const SizedBox(height: 4),
            Text(
              msg['time'] as String,
              style: TextStyle(
                fontSize: 10,
                color: isMe ? Colors.white70 : textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMaskedCallScreen(
    bool isDark,
    Color surfaceColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.shield, color: AppColors.verifiedEmerald, size: 14),
                        SizedBox(width: 6),
                        Text(
                          'ServiceOS Masked Call (Private)',
                          style: TextStyle(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  CircleAvatar(
                    radius: 56,
                    backgroundImage: widget.peerAvatar.startsWith('http')
                        ? NetworkImage(widget.peerAvatar) as ImageProvider
                        : AssetImage(widget.peerAvatar),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.peerName,
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.peerRole,
                    style: const TextStyle(fontSize: 14, color: Colors.white70),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Connected • 00:48',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.verifiedEmerald),
                  ),
                ],
              ),
            ),

            // Call Controls
            Padding(
              padding: const EdgeInsets.fromLTRB(32, 0, 32, 48),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildCallBtn(Icons.mic_off, 'Mute', Colors.white24, Colors.white),
                      _buildCallBtn(Icons.volume_up, 'Speaker', Colors.white24, Colors.white),
                      _buildCallBtn(Icons.chat, 'Message', Colors.white24, Colors.white),
                    ],
                  ),
                  const SizedBox(height: 36),
                  GestureDetector(
                    onTap: _endVoIPCall,
                    child: Container(
                      height: 64,
                      width: 64,
                      decoration: const BoxDecoration(
                        color: AppColors.errorRed,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.call_end, color: Colors.white, size: 32),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCallBtn(IconData icon, String label, Color bg, Color fg) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
          child: Icon(icon, color: fg, size: 24),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.white70)),
      ],
    );
  }
}
