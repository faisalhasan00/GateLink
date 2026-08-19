import 'package:flutter_test/flutter_test.dart';
import 'package:partner_app/main.dart';

void main() {
  testWidgets('GateLink Partner App Smoke Test', (WidgetTester tester) async {
    await tester.pumpWidget(const GateLinkPartnerApp());
    expect(find.text('GateLink Partner'), findsOneWidget);
  });
}
