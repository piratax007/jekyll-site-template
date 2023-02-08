FROM jekyll/builder
RUN chown -R jekyll:jekyll /usr/gem
USER jekyll
RUN mkdir /home/jekyll/app
WORKDIR /home/jekyll/app
COPY --chown=jekyll . /home/jekyll/app
RUN bundle install
RUN npm install
CMD ["yarn","develop"]
EXPOSE 4000