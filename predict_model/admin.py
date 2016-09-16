from django.contrib import admin

# Register your models here.

from predict_model.models import tweets 

class Tweetadmin(admin.ModelAdmin):
    list_display = ('id','data_tweet_id','tweet_text','machine_label','human_label','is_trainable')
    fields = ('data_tweet_id','tweet_text','machine_label','human_label','is_trainable')

admin.site.register(tweets,Tweetadmin)

