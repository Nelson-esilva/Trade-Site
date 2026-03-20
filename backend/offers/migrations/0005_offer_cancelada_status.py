from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('offers', '0004_alter_offer_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offer',
            name='status',
            field=models.CharField(
                choices=[
                    ('pendente', 'Pendente'),
                    ('aceita', 'Aceita'),
                    ('recusada', 'Recusada'),
                    ('trocado', 'Trocado'),
                    ('cancelada', 'Cancelada'),
                ],
                default='pendente',
                max_length=10,
            ),
        ),
    ]
