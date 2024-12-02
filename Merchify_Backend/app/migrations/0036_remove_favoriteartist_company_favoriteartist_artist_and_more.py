# Generated by Django 4.2.16 on 2024-11-09 21:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0035_remove_favoriteartist_artist_favoriteartist_company_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='favoriteartist',
            name='company',
        ),
        migrations.AddField(
            model_name='favoriteartist',
            name='artist',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='favoritesArtist', to='app.artist'),
        ),
        migrations.AlterField(
            model_name='favoriteartist',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favoritesArtist', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='FavoriteCompany',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='favoriteCompany', to='app.company')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favoriteCompany', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
