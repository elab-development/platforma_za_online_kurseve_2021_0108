public function up()
{
    Schema::table('certificates', function (Blueprint $table) {
        $table->dropColumn('file_path');
    });
}

public function down()
{
    Schema::table('certificates', function (Blueprint $table) {
        $table->string('file_path')->nullable();
    });
}
