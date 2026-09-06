import 'package:flutter_test/flutter_test.dart';
import 'package:society_admin_app/core/models/society_model.dart';

void main() {
  test('SocietyModel instantiates properly', () {
    final society = SocietyModel(
      id: 'soc_123',
      name: 'Green Heights',
      totalFlats: 120,
    );
    expect(society.id, 'soc_123');
    expect(society.name, 'Green Heights');
    expect(society.totalFlats, 120);
  });
}
