FROM jekyll/builder
RUN chown -R jekyll:jekyll /usr/gem
USER jekyll
VOLUME /home/jekyll/app
WORKDIR /home/jekyll/app
CMD ["yarn","develop"]
EXPOSE 35729
EXPOSE 4000
